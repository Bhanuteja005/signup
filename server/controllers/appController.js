import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import UserModel from '../model/User.model.js';
dotenv.config();

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "the_247",
  "password" : "RAJ@482003",
  "email": "the_247@superverse.com",
  "firstName" : "Raj",
  "lastName": "Patel",
  "mobile": 1234567890,
  "address" : "A-111, Burj Khalifa, Dubai",
  "profile": "<image-uri>"
}
*/
export async function register(req, res) {
    try {
        const { username, password, email, profile } = req.body;

        // check username exists
        const isUsernameExist = new Promise((resolve, reject) => {
            UserModel.findOne({ username })
                .then((data) => (data ? reject({ error: 'Username already exists...!' }) : resolve()))
                .catch((err) => reject({ isUsernameExist: err }));
        });

        // check email exists
        const isEmailExists = new Promise((resolve, reject) => {
            UserModel.findOne({ email })
                .then((data) => (data ? reject({ error: 'Email already registered...!' }) : resolve()))
                .catch((err) => reject({ isEmailExistsError: err }));
        });

        Promise.all([isUsernameExist, isEmailExists])
            .then(() => {
                hashPassword(password)
                    .then((hashedPassword) => {
                        const user = new UserModel({
                            username: username,
                            password: hashedPassword,
                            profile: profile || '',
                            email: email,
                        });

                        user.save()
                            .then(() => res.status(201).send({ msg: 'User Registered Successfully.' }))
                            .catch(() => res.status(500).send({ error: 'User Registration Failed...!' }));
                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    });
            })
            .catch((err) => res.status(500).send(err));
    } catch (err) {
        return res.status(401).send(err);
    }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "the_247",
  "password" : "RAJ@482003",
  }
*/
export async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Log the request payload
        console.log('Login request payload:', req.body);

        // Find user by username
        const user = await UserModel.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ error: 'Login Failed...!', e: 'User not found' });
        }

        // Log the hashed password from the database
        console.log('Hashed password from database:', user.password);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ error: 'Login Failed...!', e: 'Password not match' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
}
/** GET: http://localhost:8080/api/user/the_247 */
export async function getUser(req, res) {
    try {
        const { username } = req.params;
        UserModel.findOne({ username })
            .then((data) => {
                const { password, ...rest } = Object.assign({}, data.toJSON());
                return res.status(201).send(rest);
            })
            .catch((err) => res.status(501).send({ error: 'Username Not Found' }));
    } catch (err) {
        return res.status(401).send(err);
    }
}

/** PUT: http://localhost:8080/api/update-user 
 * @param: {
        "id" : "token"
    }
    body: {
        firstName: '',
        address : '',
        profile : ''
    }
*/
export async function updateUser(req, res) {
    try {
        const { userId } = req.user;
        if (userId) {
            const newData = req.body;
            const { email } = newData;

            // check email exists
            const isEmailExists = new Promise((resolve, reject) => {
                UserModel.findOne({ email, _id: { $ne: userId } })
                    .then((data) => (data ? reject({ error: 'Email already registered...!' }) : resolve()))
                    .catch((err) => reject({ isEmailExistsError: err }));
            });

            isEmailExists
                .then(() => {
                    UserModel.updateOne({ _id: userId }, newData)
                        .then((data) => res.status(201).send({ msg: 'User Data Updated' }))
                        .catch((err) => res.status(500).send({ error: "Couldn't Update the Profile...!", err }));
                })
                .catch((err) => {
                    res.status(500).send(err);
                });
        } else {
            return res.status(404).send({ error: 'Invalid User Id...!' });
        }
    } catch (err) {
        return res.status(401).send(err);
    }
}

/** GET: http://localhost:8080/api/generate-otp */
export async function generateOTP(req, res) {
    try {
        const OTP = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        req.app.locals.OTP = OTP;
        res.status(201).send({ OTP: OTP });
    } catch (err) {
        res.status(401).send(err);
    }
}

/** GET: http://localhost:8080/api/verify-otp */
export async function verifyOTP(req, res) {
    try {
        const { otp } = req.query;
        const generatedOTP = req.app.locals.OTP;
        if (parseInt(otp) == parseInt(generatedOTP)) {
            req.app.locals.OTP = null; // Resets the OTP
            req.app.locals.resetSession = true; // Starts the password reset session
            return res.status(201).send({ msg: 'OTP Verified Successfully' });
        } else {
            return res.status(400).send({ error: 'Invalid OTP' });
        }
    } catch (err) {
        res.status(401).send(err);
    }
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/create-reset-session */
export async function createResetSession(req, res) {
    try {
        if (req.app.locals.resetSession) {
            return res.status(201).send({ msg: 'Access granted!', flag: req.app.locals.resetSession });
        } else {
            return res.status(440).send({ error: 'Session expired!' });
        }
    } catch (err) {
        res.status(401).send(err);
    }
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/reset-password */
export async function resetPassword(req, res) {
    if (!req.app.locals.resetSession) return res.status(440).send({ error: 'Session expired!' });

    try {
        const { username, password } = req.body;
        UserModel.findOne({ username })
            .then((data) => {
                hashPassword(password)
                    .then((hashedPassword) => {
                        UserModel.updateOne({ username: data.username }, { password: hashedPassword })
                            .then(() => {
                                req.app.locals.resetSession = false;
                                res.status(201).send({ msg: 'Password Updated Successfully' });
                            })
                            .catch(() => res.status(500).send({ error: 'Password Updation Failed' }));
                    })
                    .catch((err) => res.status(500).send(err));
            })
            .catch((err) => res.status(404).send({ error: 'Username Not Found' }));
    } catch (err) {
        res.status(401).send(err);
    }
}

// Helper Functions
async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        if (password) {
            bcrypt
                .hash(password, 10)
                .then((hashedPassword) => resolve(hashedPassword))
                .catch((error) => reject({ error: 'Unable to hash Password' }));
        } else {
            reject({ error: 'Invalid Password' });
        }
    });
}

async function comparePassword(originalPass, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt
            .compare(originalPass, hashedPassword)
            .then((isCorrect) => (isCorrect ? resolve() : reject({ error: "Password Doesn't Match" })))
            .catch((err) => reject({ error: 'Password Comparison Failed' }));
    });
}
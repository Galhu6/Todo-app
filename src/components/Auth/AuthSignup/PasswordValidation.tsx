import { useState, useEffect } from "react";

type PasswordCriteria = {
    length: boolean;
    uppercase: boolean;
    number: boolean;
    specialChar: boolean;
    englishOnly: boolean;
};

const validatePassword = (password: string): PasswordCriteria => {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        englishOnly: /^[\x00-\x7F]*$/.test(password),
    };
};

const isPasswordValid = (criteria: PasswordCriteria): boolean =>
    Object.values(criteria).every(val => val === true);


export const PasswordValidation = ({
    onChange,
}: {
    onChange: (
        password: string,
        confirmPassword: string,
        isValid: boolean,
        isMatch: boolean
    ) => void;
}) => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [criteria, setCriteria] = useState<PasswordCriteria>({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
        englishOnly: false,
    });
    useEffect(() => {
        const validated = validatePassword(password);
        const match = password === confirmPassword;
        setCriteria(validated);
        onChange(password, confirmPassword, isPasswordValid(validated), match);
    }, [password, confirmPassword]);

    const getColor = (valid: boolean) => valid ? 'green' : 'red';



    return (
        <div className="signup-password">
            <div className="password">
                <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {(password.length > 0) && (<ul>
                    <li
                        style={{ color: getColor(criteria.length) }}
                    >8 characters minimum</li>
                    <li
                        style={{ color: getColor(criteria.uppercase) }}
                    >At least one capital letter (A-Z)</li>
                    <li
                        style={{ color: getColor(criteria.number) }}
                    >At least one number (0-9)</li>
                    <li
                        style={{ color: getColor(criteria.specialChar) }}
                    >At least one special character</li>
                    <li
                        style={{ color: getColor(criteria.englishOnly) }}
                    >only english characters</li>
                </ul>)}

            </div>
            <div className="password-confirm">
                <input
                    type="password"
                    placeholder="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword.length > 0 && (
                    <p style={{ color: password === confirmPassword ? 'green' : 'red' }}>
                        {password === confirmPassword
                            ? "Passwords match"
                            : "Passwords do not match"
                        }
                    </p>
                )}

            </div>
        </div>
    )
}

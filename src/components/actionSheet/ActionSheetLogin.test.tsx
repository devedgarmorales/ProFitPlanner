import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ActionSheetLogin from './ActionSheetLogin';
import useLogin from '../../hooks/login/useLogin.tsx';

// Mock ActionSheet to render children directly
jest.mock('react-native-actions-sheet', () => {
return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
};
});

// Mock de las funciones necesarias
jest.mock('../../hooks/login/useLogin.tsx', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../../store/loaderStore.tsx', () => ({
    default: jest.fn(() => ({
        showLoader: jest.fn(),
        hideLoader: jest.fn(),
    })),
}));

jest.mock('../../service/toast.tsx', () => ({
    showToast: jest.fn(),
}));

const mockNavigate = jest.fn();

const mockFormValues = {
    email: "nightmare3",
    password: "sfa12345",
};

describe('ActionSheetLogin Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useLogin as jest.Mock).mockReturnValue({
            passwordVisible: false,
            setPasswordVisible: jest.fn(),
            handleInputChange: jest.fn(),
            sendLogin: jest.fn(),
            formValues: { email: '', password: '' },
            actionSheetRef: { current: { show: jest.fn(), hide: jest.fn() } },
            hideActionSheet: jest.fn(),
        });
    });

    it('renders the component correctly', async () => {
        const { getByTestId } = render(
            <NavigationContainer>
                <ActionSheetLogin navigation={{ navigate: mockNavigate }} />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByTestId('login-title')).toBeTruthy();
            expect(getByTestId('login-subtitle')).toBeTruthy();
        });
    });

    it('shows error message when fields are empty', async () => {
        const { getByTestId } = render(
            <NavigationContainer>
                <ActionSheetLogin navigation={{ navigate: mockNavigate }} />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByTestId('login-button')).toBeTruthy();
        });

        fireEvent.press(getByTestId('login-button'));

        await waitFor(() => {
            expect(require('../../service/toast.tsx').showToast).toHaveBeenCalledWith(
                'error',
                '¡Ocurrió un error!',
                'Los campos son requeridos'
            );
        });
    });

    it('calls sendLogin with correct data', async () => {
        const mockSendLogin = jest.fn();
        (useLogin as jest.Mock).mockReturnValue({
            passwordVisible: false,
            setPasswordVisible: jest.fn(),
            handleInputChange: jest.fn((field, value) => {
                if (field === 'email') mockFormValues.email = value;
                if (field === 'password') mockFormValues.password = value;
            }),
            sendLogin: mockSendLogin,
            formValues: { email: '', password: '' },
            actionSheetRef: { current: { show: jest.fn(), hide: jest.fn() } },
            hideActionSheet: jest.fn(),
        });

        const { getByTestId } = render(
            <NavigationContainer>
                <ActionSheetLogin navigation={{ navigate: mockNavigate }} />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByTestId('email-input')).toBeTruthy();
            expect(getByTestId('password-input')).toBeTruthy();
        });

        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password123');

        fireEvent.press(getByTestId('login-button'));

        await waitFor(() => {
            expect(mockSendLogin).toHaveBeenCalled();
            expect(mockSendLogin).toHaveBeenCalledWith(mockNavigate);
        });
    });

    it('navigates to Register screen when link is pressed', async () => {
        const { getByTestId } = render(
            <NavigationContainer>
                <ActionSheetLogin navigation={{ navigate: mockNavigate }} />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByTestId('register-link')).toBeTruthy();
        });

        fireEvent.press(getByTestId('register-link'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Register');
        });
    });
});

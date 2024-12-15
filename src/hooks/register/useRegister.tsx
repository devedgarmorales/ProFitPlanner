import {useState} from "react";
import {showToast} from "../../service/toast.tsx";

const useRegister = ({navigation}: any) => {
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [isSelected, setIsSelected] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleCheckboxChange = () => {
        setIsSelected(!isSelected);
    };

    const handleInputChange = (inputName: string, inputValue: string) => {
        setFormValues({
            ...formValues,
            [inputName]: inputValue,
        });
    };

    const sendRegisterData = async () => {
        if (!formValues.name || !formValues.email || !formValues.password || !formValues.confirmPassword) {
            return showToast('error', '¡Ocurrió un error!', 'Todos los campos son obligatorios');
        }

        navigation.navigate("Login")
    };

    return {
        formValues,
        handleCheckboxChange,
        handleInputChange,
        sendRegisterData,
        isSelected,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
    }
};

export default useRegister;

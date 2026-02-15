import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

export const showToast = (type: ToastType, text: string) => {

    const handleText = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'Sucesso!';
            case 'error':
                return 'Opa';
            case 'info':
                return 'Informação!';
            default:
                return '';
        }    
    }

     Toast.show({
      type: type,
      text1: handleText(type),
      text2: text
    });
}
import Button from '@/src/components/button';
import { Screen } from '@/src/components/screen';
import Text from '@/src/components/text';
import TextInputComponent from '@/src/components/textInput';
import { useTheme } from '@/src/components/theme/useTheme';
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from 'react-native';

export default function Auth() {
  const { colors } = useTheme();
 return (
    <Screen style={{ justifyContent: 'center', alignItems: 'center'}}>
    <Image source={require('@/src/assets/images/nerdLogo.png')} style={{ width: 200, height: 200, marginBottom: 20 }} />
    <Text variant='heading'>Bem-Vindo, Nerd!</Text>
    <TextInputComponent label='Email' style={{ width: '100%' }} placeholder='Digite o Email...' />
    <TextInputComponent label='Senha' style={{ width: '100%' }} placeholder='Digite a Senha...' />
    <Button title='Login' icon={<Entypo name="login" size={16} color={colors.text} />} variant='primary' disabled={false} onPress={() => alert('Login pressed')} style={{ width: '100%', marginTop: 10 }}/>
  </Screen> 
  );
}
import Button from '@/src/components/button';
import { Screen } from '@/src/components/screen';
import Text from '@/src/components/text';
import TextInputComponent from '@/src/components/textInput';
import { useTheme } from '@/src/components/theme/useTheme';
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from 'react-native';
import useLoginModel from './login.model';
import styles from './styles';

export default function Auth() {
  const { colors } = useTheme();
  const { email, setEmail, password, setPassword, handleLogin } = useLoginModel();

  return (
    <Screen style={styles.container}>
      <Image
        source={require('@/src/assets/images/nerdLogo.png')}
        style={styles.logo}
      />

      <Text variant="heading">Bem-Vindo, Nerd!</Text>

      <TextInputComponent
        label="Email"
        style={styles.input}
        placeholder="Digite o Email..."
        onChangeText={setEmail}
        value={email}
      />

      <TextInputComponent
        label="Senha"
        style={styles.input}
        placeholder="Digite a Senha..."
        onChangeText={setPassword}
        value={password}
      />

      <Button
        title="Login"
        icon={<Entypo name="login" size={16} color={colors.text} />}
        variant="primary"
        disabled={false}
        onPress={handleLogin}
        style={styles.button}
      />
    </Screen>
  );
}

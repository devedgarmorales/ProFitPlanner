import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClientStore } from '../../store/clientStore';
import {
  clientStyles as styles,
  ClientStatus,
} from '../../components/ClientLayout';
import { Hero, ui } from '../../components/ClientUi';
export function LoginScreen() {
  const { colors } = useTheme();
  const { login, busy, mfaToken } = useClientStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={[styles.page, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={ui.loginScroll}
        >
          <Hero
            icon="dumbbell"
            title="ProFitPlanner"
            subtitle="Tu entrenamiento, acompañado por tu coach."
          />
          <View style={styles.content}>
            <ClientStatus />
            {mfaToken ? (
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="shield-key-outline" />}
                label="Código de autenticación o recuperación"
                value={code}
                onChangeText={setCode}
                autoCapitalize="none"
              />
            ) : (
              <>
                <TextInput
                  mode="outlined"
                  left={<TextInput.Icon icon="email-outline" />}
                  label="Correo electrónico"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <TextInput
                  mode="outlined"
                  left={<TextInput.Icon icon="lock-outline" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      accessibilityLabel={
                        showPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                      onPress={() => setShowPassword((value) => !value)}
                    />
                  }
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="current-password"
                />
              </>
            )}
            <Button
              mode="contained"
              contentStyle={ui.cta}
              loading={busy}
              disabled={busy || (mfaToken ? !code : !email.trim() || !password)}
              onPress={() => login(email, password, code)}
            >
              {mfaToken ? 'Verificar código' : 'Iniciar sesión'}
            </Button>
            {!!mfaToken && (
              <Button onPress={() => useClientStore.setState({ mfaToken: '' })}>
                Volver al inicio de sesión
              </Button>
            )}
            <Text variant="bodySmall" style={ui.footnote}>
              Utiliza la cuenta de cliente que tienes registrada con tu coach.
              Para recuperar el acceso, utiliza la plataforma web.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

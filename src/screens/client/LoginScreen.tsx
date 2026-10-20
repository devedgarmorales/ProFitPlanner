import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClientStore } from '../../store/clientStore';
import {
  clientStyles as styles,
  ClientStatus,
} from '../../components/ClientLayout';
export function LoginScreen() {
  const { colors } = useTheme();
  const { login, busy, mfaToken } = useClientStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  return (
    <SafeAreaView style={[styles.page, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <Text variant="headlineLarge">ProFitPlanner</Text>
          <Text variant="titleMedium">
            Tu entrenamiento, acompañado por tu coach.
          </Text>
          <ClientStatus />
          {mfaToken ? (
            <TextInput
              label="Código de autenticación o recuperación"
              value={code}
              onChangeText={setCode}
              autoCapitalize="none"
            />
          ) : (
            <>
              <TextInput
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <TextInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="current-password"
              />
            </>
          )}
          <Button
            mode="contained"
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
          <Text>
            Utiliza la cuenta de cliente que tienes registrada con tu coach.
            Para recuperar el acceso, utiliza la plataforma web.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props extends TextInputProps {
  label: string;
  errorMessage?: string;
}

const TextField = forwardRef<TextInput, Props>(({ label, errorMessage, style, ...props }, ref) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <View style={styles.container}>
      <Text style={[styles.label, isDark && { color: '#E2E8F0' }]}>{label}</Text>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          isDark && { backgroundColor: '#1E293B', color: '#F8FAFC', borderColor: '#334155' },
          errorMessage && { borderColor: '#F87171' },
          style
        ]}
        placeholderTextColor={isDark ? '#94A3B8' : '#94A3B8'}
        {...props}
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
});

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#0F172A'
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#F87171'
  }
});

export default TextField;

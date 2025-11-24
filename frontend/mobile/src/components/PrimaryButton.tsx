import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props extends React.ComponentProps<typeof Pressable> {
  title: string;
  style?: StyleProp<ViewStyle>;
}

const PrimaryButton: React.FC<Props> = ({ title, style, ...props }) => {
  const { theme } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme === 'dark' ? '#6366F1' : '#4F46E5', opacity: pressed ? 0.8 : 1 },
        style
      ]}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});

export default PrimaryButton;

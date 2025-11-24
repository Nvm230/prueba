import { Ionicons } from '@expo/vector-icons';

const TabBarIcon = ({ name, color, size }: { name: keyof typeof Ionicons.glyphMap; color: string; size: number }) => (
  <Ionicons name={name} color={color} size={size} />
);

export default TabBarIcon;

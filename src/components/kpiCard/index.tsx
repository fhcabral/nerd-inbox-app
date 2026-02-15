import { View } from 'react-native';
import { useTheme } from '../../contexts/theme/useTheme';
import Text from '../text';

export default function KpiCard({data}: any) {
    const { layout, colors } = useTheme()
 return (
         <View
           style={{
             flexDirection: "row",
             flexWrap: "wrap",
             gap: layout.space[3],
             marginBottom: layout.space[5],
           }}
         >
           {data.map((kpi: any) => (
             <View
               key={kpi.label}
               style={{
                 width: "48%",
                 backgroundColor: colors.elevated,
                 borderRadius: layout.radius.lg,
                 borderWidth: layout.borderWidth.hairline,
                 borderColor: colors.border,
                 padding: layout.space[4],
               }}
             >
               <Text variant="caption" style={{ color: colors.textMuted }}>
                 {kpi.label}
               </Text>
               <Text variant="bodyStrong" style={{ marginTop: layout.space[2] }}>
                 {kpi.value}
               </Text>
             </View>
           ))}
         </View>
  );
}
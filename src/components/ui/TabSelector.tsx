import React, { useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated,
} from 'react-native';
import { Colors, FontFamily, FontSize } from '@theme/index';

export interface TabItem {
  key: string;
  label: string;
  icon?: string;
}

interface TabSelectorProps {
  tabs: TabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  scrollable?: boolean;
  variant?: 'pills' | 'underline' | 'capsule';
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeKey,
  onSelect,
  scrollable = false,
  variant = 'pills',
}) => {
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: styles.scrollContent }
    : { style: styles.row };

  return (
    <View style={[styles.wrapper, variant === 'underline' && styles.wrapperUnderline]}>
      <Container {...(containerProps as any)}>
        {tabs.map(tab => {
          const isActive = tab.key === activeKey;

          if (variant === 'underline') {
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.underlineTab, isActive && styles.underlineTabActive]}
                onPress={() => onSelect(tab.key)}
                activeOpacity={0.7}
              >
                {tab.icon && <Text style={styles.tabIcon}>{tab.icon}</Text>}
                <Text style={[styles.underlineLabel, isActive && styles.activeLabelUnderline]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          if (variant === 'capsule') {
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.capsuleTab, isActive && styles.capsuleTabActive]}
                onPress={() => onSelect(tab.key)}
                activeOpacity={0.7}
              >
                {tab.icon && <Text style={styles.tabIcon}>{tab.icon}</Text>}
                <Text style={[styles.capsuleLabel, isActive && styles.activeLabelCapsule]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          // pills (default)
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.pillTab, isActive && styles.pillTabActive]}
              onPress={() => onSelect(tab.key)}
              activeOpacity={0.7}
            >
              {tab.icon && <Text style={styles.tabIcon}>{tab.icon}</Text>}
              <Text style={[styles.pillLabel, isActive && styles.activeLabelPill]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.glassSurface,
    borderRadius: 12,
    padding: 4,
  },
  wrapperUnderline: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
    borderRadius: 0,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 14,
  },
  // Pills
  pillTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  pillTabActive: {
    backgroundColor: Colors.primary,
  },
  pillLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  activeLabelPill: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bold,
  },
  // Underline
  underlineTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  underlineTabActive: {
    borderBottomColor: Colors.primary,
  },
  underlineLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  activeLabelUnderline: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bold,
  },
  // Capsule
  capsuleTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  capsuleTabActive: {
    backgroundColor: Colors.primaryDim ?? Colors.primary + '33',
    borderColor: Colors.primary,
  },
  capsuleLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  activeLabelCapsule: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
});

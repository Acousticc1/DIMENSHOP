import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { DollarSign, Package, Rotate3d, Plus, ArrowRight } from 'lucide-react-native';
import { THEME } from '../../styles/theme';
import { Card } from '../../presentation/components/ui/Card';

export default function SellerDashboard() {
  const router = useRouter();

  // Mock dashboard stats
  const stats = {
    earnings: 1250.00,
    soldCount: 8,
    activeJobs: 1,
  };

  const handleAddNewProduct = () => {
    router.push('/(seller)/product-form');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Dashboard Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Dashboard</Text>
        <Text style={styles.headerSubtitle}>Monitor your earnings and 3D processing pipelines</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stat Cards Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
              <DollarSign color={THEME.colors.success} size={22} />
            </View>
            <Text style={styles.statValue}>${stats.earnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(10, 132, 255, 0.15)' }]}>
              <Package color={THEME.colors.info} size={22} />
            </View>
            <Text style={styles.statValue}>{stats.soldCount}</Text>
            <Text style={styles.statLabel}>Items Sold</Text>
          </Card>
        </View>

        <Card style={styles.fullWidthCard}>
          <View style={styles.jobHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
              <Rotate3d color={THEME.colors.primary} size={22} />
            </View>
            <View style={styles.jobHeaderTextContainer}>
              <Text style={styles.jobValue}>{stats.activeJobs} Active Job</Text>
              <Text style={styles.jobLabel}>Photogrammetry pipeline status</Text>
            </View>
          </View>
          
          {/* Active Job Item Detail */}
          <View style={styles.jobDetailItem}>
            <View style={styles.jobInfoRow}>
              <Text style={styles.jobProductTitle}>Futuristic Watch Draft</Text>
              <Text style={styles.jobStatusBadge}>Meshing (65%)</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '65%' }]} />
            </View>
          </View>
        </Card>

        {/* Quick Actions Card */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.actionRow} 
          activeOpacity={0.8}
          onPress={handleAddNewProduct}
        >
          <View style={styles.actionIconWrapper}>
            <Plus color="#FFFFFF" size={20} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Add New Product</Text>
            <Text style={styles.actionDesc}>Upload photos and trigger 3D reconstruction</Text>
          </View>
          <ArrowRight color={THEME.colors.textSecondary} size={18} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  fullWidthCard: {
    width: '100%',
    marginBottom: 24,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  jobHeaderTextContainer: {
    marginLeft: 12,
  },
  jobValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  jobLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  jobDetailItem: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 16,
  },
  jobInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobProductTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  jobStatusBadge: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: THEME.colors.border,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  actionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  actionDesc: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});

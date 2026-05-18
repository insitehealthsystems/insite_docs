import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Insite Dashboard",
  description: "Documentation and Metrics for Insite Dashboard",
  srcDir: '.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Metrics', link: '/metrics/README' },
      { text: 'Formulas', link: '/metrics/FORMULAS' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/metrics/README' },
          { text: 'Formulas Reference', link: '/metrics/FORMULAS' }
        ]
      },
      {
        text: 'Executive Metrics',
        collapsed: false,
        items: [
          { text: 'Total Assets', link: '/metrics/executive/01-total-assets' },
          { text: 'Active Assets', link: '/metrics/executive/02-active-assets' },
          { text: 'Utilization Rate', link: '/metrics/executive/03-utilization-rate' },
          { text: 'Potentially Lost', link: '/metrics/executive/04-potentially-lost' },
          { text: 'Monthly Labor Savings', link: '/metrics/executive/05-monthly-labor-savings' },
          { text: 'Annual Labor Savings', link: '/metrics/executive/06-annual-labor-savings' },
          { text: 'Avoided Purchases', link: '/metrics/executive/07-avoided-purchases' },
          { text: 'Search Time Reduction', link: '/metrics/executive/08-search-time-reduction' },
          { text: 'Availability Score', link: '/metrics/executive/09-availability-score' },
          { text: 'Distribution Efficiency', link: '/metrics/executive/10-distribution-efficiency' },
          { text: 'ROI Trend', link: '/metrics/executive/11-roi-trend' }
        ]
      },
      {
        text: 'Operations Metrics',
        collapsed: true,
        items: [
          { text: 'Zone Efficiency Score', link: '/metrics/operations/12-zone-efficiency-score' },
          { text: 'Zone Dwell Time', link: '/metrics/operations/13-zone-dwell-time' },
          { text: 'Zone Traffic Volume', link: '/metrics/operations/14-zone-traffic-volume' },
          { text: 'Department Utilization', link: '/metrics/operations/15-department-utilization' },
          { text: 'Hoarding Detection', link: '/metrics/operations/16-hoarding-detection' }
        ]
      },
      {
        text: 'Asset Metrics',
        collapsed: true,
        items: [
          { text: 'High Utilization Count', link: '/metrics/assets/17-high-utilization-count' },
          { text: 'Low Idle Count', link: '/metrics/assets/18-low-idle-count' },
          { text: 'Asset Classification', link: '/metrics/assets/19-asset-classification' },
          { text: 'Over Purchased Types', link: '/metrics/assets/20-over-purchased-types' },
          { text: 'Redistributable Units', link: '/metrics/assets/21-redistributable-units' },
          { text: 'Avoided Purchase Value', link: '/metrics/assets/22-avoided-purchase-value' }
        ]
      },
      {
        text: 'Nursing Metrics',
        collapsed: true,
        items: [
          { text: 'Avg Search Duration', link: '/metrics/nursing/23-avg-search-duration' },
          { text: 'Search Success Rate', link: '/metrics/nursing/24-search-success-rate' },
          { text: 'Proximity Accuracy', link: '/metrics/nursing/25-proximity-accuracy' },
          { text: 'Time to Asset', link: '/metrics/nursing/26-time-to-asset' },
          { text: 'Availability Confidence', link: '/metrics/nursing/27-availability-confidence' },
          { text: 'Nursing Interruptions', link: '/metrics/nursing/28-nursing-interruptions' },
          { text: 'Time Away from Patients', link: '/metrics/nursing/29-time-away-patients' },
          { text: 'Equipment Escalation Calls', link: '/metrics/nursing/30-equipment-escalation-calls' },
          { text: 'Shift Efficiency Score', link: '/metrics/nursing/31-shift-efficiency-score' },
          { text: 'Equipment Turnaround Time', link: '/metrics/nursing/32-equipment-turnaround-time' },
          { text: 'Failed Searches', link: '/metrics/nursing/33-failed-searches' },
          { text: 'Labor Savings Formula', link: '/metrics/nursing/34-labor-savings-formula' }
        ]
      },
      {
        text: 'Pilot Phase',
        collapsed: true,
        items: [
          { text: 'Coverage Zones', link: '/metrics/pilot/35-coverage-zones' },
          { text: 'Movement Events', link: '/metrics/pilot/36-movement-events' },
          { text: 'Recovery Examples', link: '/metrics/pilot/37-recovery-examples' },
          { text: 'Pilot Phases', link: '/metrics/pilot/38-pilot-phases' }
        ]
      },
      {
        text: 'Search Analytics',
        collapsed: true,
        items: [
          { text: 'Total Searches', link: '/metrics/search/39-total-searches' },
          { text: 'Success Rate', link: '/metrics/search/40-success-rate' },
          { text: 'No-Results Rate', link: '/metrics/search/41-no-results-rate' },
          { text: 'Top Source', link: '/metrics/search/42-top-source' },
          { text: 'Most Searched Types', link: '/metrics/search/43-most-searched-types' },
          { text: 'Per-Type Success Rate', link: '/metrics/search/44-per-type-success-rate' },
          { text: 'Source Breakdown', link: '/metrics/search/45-source-breakdown' },
          { text: 'Daily Volume Trend', link: '/metrics/search/46-daily-volume-trend' },
          { text: 'Recent Searches Feed', link: '/metrics/search/47-recent-searches' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Insite Dashboard'
    }
  }
})

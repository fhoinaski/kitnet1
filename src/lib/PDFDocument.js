import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10 },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 'auto', marginTop: 5, fontSize: 10 }
});

const PDFDocument = ({ items }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Orçamento</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Produto</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Quantidade</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Preço Unitário</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Total</Text></View>
        </View>
        {items.map((item) => (
          <View style={styles.tableRow} key={item.id}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.name}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>R$ {item.price.toFixed(2)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>R$ {(item.quantity * item.price).toFixed(2)}</Text></View>
          </View>
        ))}
      </View>
      <Text style={{ marginTop: 20 }}>Total: R$ {items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}</Text>
    </Page>
  </Document>
);

export default PDFDocument;
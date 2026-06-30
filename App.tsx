import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import mqtt from 'mqtt/dist/mqtt'; // v4'te React Native için doğrudan derlenmiş saf JS dosyasını çağırıyoruz

export default function App() {
  const [status, setStatus] = useState('Buluta Bağlanıyor...');
  const [plcMessage, setPlcMessage] = useState('Veri bekleniyor...');
  const [mqttClient, setMqttClient] = useState<any>(null);

  // !!! BURAYI GÜNCELLE !!!
  // HiveMQ Overview sekmesinden aldığın adresi buraya yapıştır (Başına wss:// ekleme, sadece saf URL)
  const CLUSTER_URL = '771e1c593e814412b3a81a6ad2b0eaf3.s1.eu.hivemq.cloud'; 
  const USERNAME = 'kerem';
  const PASSWORD = 'Kerem_81';

  useEffect(() => {
    // HiveMQ Cloud WebSockets güvenli adresi (Port 8884)
    const connectionUrl = `wss://${CLUSTER_URL}:8884/mqtt`;

    console.log('Bağlantı kuruluyor:', connectionUrl);

    // v4 standartlarında el sıkışma ayarları
    const client = mqtt.connect(connectionUrl, {
      username: USERNAME,
      password: PASSWORD,
      clientId: 'Wago_Mobile_' + Math.random().toString(16).substring(2, 6),
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      connectTimeout: 4000,
      reconnectPeriod: 4000,
    });

    client.on('connect', () => {
      console.log('MQTT v4 Başarıyla Bağlandı!');
      setStatus('Buluta Bağlandı ✅');
      client.subscribe('wago/durum');
    });

    client.on('message', (topic: string, message: any) => {
      console.log('PLC\'den Gelen:', message.toString());
      setPlcMessage(message.toString());
    });

    client.on('error', (err: any) => {
      console.error('MQTT Hatası:', err);
      setStatus('Bağlantı Hatası ❌');
    });

    client.on('close', () => {
      setStatus('Bağlantı Koptu!');
    });

    setMqttClient(client);

    return () => {
      if (client) client.end();
    };
  }, []);

  // PLC'ye Komut Gönderme Fonksiyonu (Publish)
  const sendCommand = (command: string) => {
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish('wago/kontrol', command);
      Alert.alert('WagoSmart', `PLC'ye giden komut: ${command}`);
    } else {
      Alert.alert('Hata', 'Bulut bağlantısı hazır değil!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>WagoSmart IIoT</Text>
        <Text style={styles.subtitle}>Staj Projesi Kontrol Paneli</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.label}>Sistem Durumu:</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.label}>PLC'den Gelen Canlı Veri:</Text>
        <Text style={styles.dataText}>{plcMessage}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.btnStart]} onPress={() => sendCommand('START')}>
          <Text style={styles.buttonText}>SİSTEMİ BAŞLAT (START)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.btnStop]} onPress={() => sendCommand('STOP')}>
          <Text style={styles.buttonText}>SİSTEMİ DURDUR (STOP)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e24', padding: 20 },
  header: { alignItems: 'center', marginTop: 30, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4caf50' },
  subtitle: { fontSize: 14, color: '#aaa', marginTop: 5 },
  statusCard: { backgroundColor: '#2a2a35', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#3a3a45' },
  label: { fontSize: 12, color: '#888', fontWeight: 'bold' },
  statusText: { fontSize: 18, color: '#fff', marginTop: 5, fontWeight: '600' },
  dataText: { fontSize: 22, color: '#ffb74d', marginTop: 5, fontWeight: 'bold' },
  buttonContainer: { marginTop: 20 },
  button: { paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  btnStart: { backgroundColor: '#4caf50' },
  btnStop: { backgroundColor: '#f44336' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
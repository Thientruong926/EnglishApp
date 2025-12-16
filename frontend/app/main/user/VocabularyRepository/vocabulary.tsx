import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Vocabulary } from '../../../../src/context/VocabularyContext';
import { useUserFolder, UserFolder } from '../../../../src/context/UserFolderContext';
import { useUserVocabulary } from '../../../../src/context/UserVocabularyContext';
import { useAuth } from '../../../../src/context/AuthContext';

// Component hiển thị từ vựng
const VocabularyItem = ({ item }: { item: Vocabulary }) => (
  <View style={styles.itemContainer}>
    <View style={styles.wordHeader}>
      <Text style={styles.word}>{item.word}</Text>
    </View>
    <Text style={styles.meaning}>- {item.meaning}</Text>
    {item.example_sentence && (
      <Text style={styles.sentence}>VD: "{item.example_sentence}"</Text>
    )}
  </View>
);

// Component hiển thị folder
const FolderItem = ({
  folder,
  isOpen,
  onToggle,
  onDelete,
}: {
  folder: UserFolder;
  isOpen: boolean;
  onToggle: (folder_id: string) => void;
  onDelete: (folder_id: string) => void;
}) => (
  <View style={{ marginBottom: 8 }}>
    <TouchableOpacity onPress={() => onToggle(folder._id)} style={styles.folderItem}>
      <Text style={styles.folderName}>
        {isOpen ? '📂' : '📁'} {folder.name}
      </Text>
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Xóa folder',
            `Bạn có chắc muốn xóa folder "${folder.name}"?`,
            [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Xóa', style: 'destructive', onPress: () => onDelete(folder._id) },
            ]
          )
        }
      >
        <Text style={{ color: '#e74c3c', fontWeight: '700' }}>Xóa</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  </View>
);

export default function VocabularyScreen() {
  const { user } = useAuth();
  const user_id = user?.id;

  const { folders, createFolder, fetchFolders, deleteFolder } = useUserFolder();
  const { userVocabs } = useUserVocabulary();

  const [newFolderName, setNewFolderName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null);

useEffect(() => {
  if (!user?.id) return; // tránh fetch khi user chưa login
  fetchFolders();
}, [user?.id]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !user_id) return;
    await createFolder(newFolderName.trim());
    setNewFolderName('');
    setShowInput(false);
  };

  const handleDeleteFolder = async (folder_id: string) => {
    if (!user_id) return;
    await deleteFolder(folder_id);
    if (openedFolderId === folder_id) setOpenedFolderId(null);
  };

const handleToggleFolder = (folder_id: string | number) => {
  const id = String(folder_id);
  setOpenedFolderId(prev => (prev === id ? null : id));
  console.log('Opened folderId set to:', id);
};


  // Lọc vocab theo folder đang mở (fix crash khi folder_id là string hoặc object)
const openedFolderVocabs = React.useMemo(() => {


  if (!openedFolderId || !userVocabs?.length) return [];
  console.log("openedFolderId:", openedFolderId);
  console.log("userVocabs:", userVocabs);

  return userVocabs.filter(uv => {
    console.log('uv.folder_id:', uv.folder_id);
    if (!uv.folder_id) return false;
    if (typeof uv.folder_id === 'string') return uv.folder_id === openedFolderId;
    if (typeof uv.folder_id === 'object') return uv.folder_id._id === openedFolderId;
    return false;
  });
}, [openedFolderId, userVocabs]);


  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View>
            <FolderItem
              folder={item}
              isOpen={openedFolderId === item._id}
              onToggle={handleToggleFolder}
              onDelete={handleDeleteFolder}
            />
            {openedFolderId === item._id && openedFolderVocabs.length > 0 && (
              <View style={{ paddingLeft: 16, marginTop: 4 }}>
                {openedFolderVocabs.map(uv => (
                  <VocabularyItem key={uv._id} item={uv.vocab_id} />
                ))}
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={
          <View style={{ marginBottom: 24 }}>
            <View style={styles.headerContainer}>
              <Ionicons name="book-outline" size={28} color="#2980b9" />
              <Text style={styles.headerTitle}>Từ Vựng Đã Lưu</Text>
              <Text style={styles.headerSubtitle}>
                Tổng hợp tất cả các từ bạn đã lưu từ các bài học.
              </Text>
            </View>

            {/* Tạo Folder */}
            <View style={{ marginTop: 16, alignItems: 'center' }}>
              {showInput ? (
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <TextInput
                    placeholder="Tên folder mới"
                    value={newFolderName}
                    onChangeText={setNewFolderName}
                    style={styles.inputFolder}
                  />
                  <TouchableOpacity style={styles.btnCreate} onPress={handleCreateFolder}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Tạo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowInput(false)}>
                    <Text style={{ color: '#e74c3c', fontWeight: '700' }}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowInput(true)}
                  style={styles.btnAddFolder}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>＋ Thêm folder</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Bạn chưa tạo folder nào.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  listContainer: { paddingVertical: 20, paddingHorizontal: 16 },
  headerContainer: { alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginTop: 8 },
  headerSubtitle: { fontSize: 14, color: '#7f8c8d', marginTop: 4, textAlign: 'center' },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#95a5a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  wordHeader: { marginBottom: 6 },
  word: { fontSize: 20, fontWeight: '700', color: '#2980b9' },
  meaning: { fontSize: 16, color: '#34495e', fontStyle: 'italic', marginBottom: 12 },
  sentence: { fontSize: 14, color: '#7f8c8d', lineHeight: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#95a5a6' },

  // Folder styles
  btnAddFolder: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inputFolder: {
    borderWidth: 1,
    borderColor: '#2980b9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: 200,
  },
  btnCreate: {
    backgroundColor: '#2980b9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  folderItem: {
    backgroundColor: '#d6eaf8',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  folderName: { fontWeight: '700', color: '#2c3e50' },
});

import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { apiUploadPhoto } from '@/services/uploadHelper';
import { Coordinates, PhotoEvidence } from '@/lib/types';
import { generateId } from '@/lib/utils';

const buildPhoto = (uri: string, type: PhotoEvidence['type'], location?: Coordinates): PhotoEvidence => ({
  id: generateId('photo'),
  uri,
  type,
  capturedAt: new Date().toISOString(),
  location,
  uploaded: false,
});

export const takePhoto = async (type: PhotoEvidence['type'], location?: Coordinates): Promise<PhotoEvidence | null> => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync({ quality: 0.7, exif: true, allowsEditing: false });
  if (result.canceled || !result.assets[0]) return null;
  return buildPhoto(result.assets[0].uri, type, location);
};

export const pickFromLibrary = async (type: PhotoEvidence['type'], location?: Coordinates): Promise<PhotoEvidence | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true });
  if (result.canceled || !result.assets[0]) return null;
  return buildPhoto(result.assets[0].uri, type, location);
};

export const cropImage = async (uri: string): Promise<string> => {
  const result = await manipulateAsync(uri, [{ resize: { width: 1280 } }], { compress: 0.8, format: SaveFormat.JPEG });
  return result.uri;
};

export const uploadPhoto = async (photo: PhotoEvidence, onProgress?: (progress: number) => void): Promise<PhotoEvidence> => {
  const uploadedUrl = await apiUploadPhoto(photo.uri, onProgress, photo);
  return { ...photo, uri: uploadedUrl, uploaded: true };
};

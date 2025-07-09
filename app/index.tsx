import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	FlatList,
	Modal,
	Platform,
	Pressable,
	Image as RNImage,
	StatusBar,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	useColorScheme,
	View,
	ViewStyle,
} from 'react-native';

// Types for Pixabay Image
type PixabayImage = {
	id: number;
	largeImageURL: string;
	webformatURL: string;
};

// Constants
const API_KEY = '51236778-fabef6f7b2708fe897f696c38';
const IMAGE_COUNT = 15;
const CATEGORIES = [
	'wallpaper',
	'nature',
	'space',
	'abstract',
	'mountains',
	'ocean',
];

export default function App() {
	// States
	const systemTheme = useColorScheme();
	const [theme, setTheme] = useState<'light' | 'dark'>(systemTheme ?? 'light');
	const [images, setImages] = useState<PixabayImage[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [selectedImage, setSelectedImage] = useState<PixabayImage | null>(null);
	const [category, setCategory] = useState(CATEGORIES[0]);

	// Fetch images
	const fetchImages = useCallback(
		async (reset = false) => {
			if (loading || loadingMore) return;
			reset ? setLoading(true) : setLoadingMore(true);

			const nextPage = reset ? 1 : page + 1;
			try {
				const response = await fetch(
					`https://pixabay.com/api/?key=${API_KEY}&q=${category}&image_type=photo&per_page=${IMAGE_COUNT}&page=${nextPage}&safesearch=true`
				);
				const data = await response.json();
				setImages((prev) => (reset ? data.hits : [...prev, ...data.hits]));
				setPage(nextPage);
			} catch (e) {
				Alert.alert('Error', 'Failed to fetch images');
			} finally {
				reset ? setLoading(false) : setLoadingMore(false);
			}
		},
		[category, page, loading, loadingMore]
	);

	useEffect(() => {
		fetchImages(true);
	}, [category]);

	// Download image
	const downloadImage = async (url: string) => {
		try {
			const { status } = await MediaLibrary.requestPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permission denied');
				return;
			}
			const fileUri = FileSystem.documentDirectory + 'wall.jpg';
			const downloadRes = await FileSystem.downloadAsync(url, fileUri);
			const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
			await MediaLibrary.createAlbumAsync('Wallpapers', asset, false);
			Alert.alert(
				'Image Saved',
				Platform.OS === 'ios' ? 'Go to Photos.' : 'Saved to gallery.'
			);
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	// Share image
	const shareImage = async (url: string) => {
		try {
			const fileUri = FileSystem.documentDirectory + 'share.jpg';
			await FileSystem.downloadAsync(url, fileUri);
			await Sharing.shareAsync(fileUri);
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	// Render component
	const renderItem = ({ item }: { item: PixabayImage }) => (
		<TouchableOpacity onPress={() => setSelectedImage(item)}>
			<View
				style={[
					styles.imageContainer,
					theme === 'dark' && styles.imageContainerDark,
				]}
			>
				<RNImage source={{ uri: item.webformatURL }} style={styles.image} />
			</View>
		</TouchableOpacity>
	);

	// theme
	const themeStyles = theme === 'dark' ? dark : light;

	return (
		<View style={[styles.container, themeStyles.container]}>
			<StatusBar
				barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
			/>

			{/* Category selector */}
			<View style={styles.categoryBar}>
				{CATEGORIES.map((cat) => (
					<TouchableOpacity
						key={cat}
						onPress={() => setCategory(cat)}
						style={[
							styles.catBtn,
							category === cat && themeStyles.catBtnActive,
						]}
					>
						<Text
							style={[
								styles.catText,
								themeStyles.catText,
								category === cat && themeStyles.catTextActive,
							]}
						>
							{cat}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Theme toggle */}
			<TouchableOpacity
				style={styles.themeBtn}
				onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			>
				<Feather
					name={theme === 'dark' ? 'sun' : 'moon'}
					size={28}
					color={themeStyles.text.color}
				/>
			</TouchableOpacity>

			{/* Image grid */}
			{loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
			<FlatList
				data={images}
				renderItem={renderItem}
				keyExtractor={(i) => i.id.toString()}
				numColumns={2}
				columnWrapperStyle={styles.row}
				onEndReached={() => fetchImages(false)}
				onEndReachedThreshold={0.5}
				ListFooterComponent={
					loadingMore ? <ActivityIndicator style={{ margin: 20 }} /> : null
				}
				contentContainerStyle={{ paddingBottom: 60 }}
			/>

			{/* Fullscreen modal */}
			<Modal visible={!!selectedImage} transparent animationType="slide">
				<View style={[styles.modalContainer, themeStyles.container]}>
					<RNImage
						source={{ uri: selectedImage?.largeImageURL }}
						style={styles.fullscreenImage}
						resizeMode="contain"
					/>
					<Pressable
						style={styles.closeButton}
						onPress={() => setSelectedImage(null)}
					>
						<AntDesign
							name="closecircle"
							size={30}
							color={themeStyles.text.color}
						/>
					</Pressable>
					<View style={styles.bottomBar}>
						<TouchableOpacity
							onPress={() => downloadImage(selectedImage!.largeImageURL)}
							style={styles.iconButton}
						>
							<Feather name="download" size={28} color="#fff" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => shareImage(selectedImage!.largeImageURL)}
							style={styles.iconButton}
						>
							<MaterialIcons name="share" size={28} color="#fff" />
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

// constants
const screenWidth = Dimensions.get('window').width;
const imageSize = screenWidth / 2 - 20;

// types for styles
interface ThemeStyles {
	container: ViewStyle;
	text: TextStyle;
	catBtnActive: ViewStyle;
	catText: TextStyle;
	catTextActive: TextStyle;
}

const light: ThemeStyles = {
	container: { backgroundColor: '#fff' },
	text: { color: '#222' },
	catBtnActive: { backgroundColor: '#ddd' },
	catText: { color: '#222' },
	catTextActive: { fontWeight: 'bold' },
};

const dark: ThemeStyles = {
	container: { backgroundColor: '#000' },
	text: { color: '#fff' },
	catBtnActive: { backgroundColor: '#333' },
	catText: { color: '#fff' },
	catTextActive: { fontWeight: 'bold' },
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 40,
	} as ViewStyle,
	row: {
		justifyContent: 'space-around',
	} as ViewStyle,
	imageContainer: {
		width: imageSize,
		borderRadius: 10,
		padding: 5,
		alignItems: 'center',
		marginBottom: 20,
	} as ViewStyle,
	imageContainerDark: {
		backgroundColor: '#222',
	} as ViewStyle,
	image: {
		width: '100%',
		height: 150,
		borderRadius: 8,
	},
	categoryBar: {
		flexDirection: 'row',
		marginHorizontal: 10,
		marginBottom: 10,
	} as ViewStyle,
	catBtn: {
		padding: 8,
		marginRight: 8,
		borderRadius: 6,
	} as ViewStyle,
	catText: {
		fontSize: 14,
	} as TextStyle,
	themeBtn: {
		position: 'absolute',
		top: 45,
		right: 20,
		padding: 6,
	} as ViewStyle,
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	} as ViewStyle,
	fullscreenImage: {
		width: '100%',
		height: '90%',
	},
	closeButton: {
		position: 'absolute',
		top: 40,
		right: 20,
	} as ViewStyle,
	bottomBar: {
		position: 'absolute',
		bottom: 40,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		width: '100%',
	} as ViewStyle,
	iconButton: {
		backgroundColor: '#333',
		padding: 14,
		borderRadius: 30,
	} as ViewStyle,
});

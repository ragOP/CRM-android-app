import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { IconButton} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RenderHTML from 'react-native-render-html';

interface Author {
  _id: string;
  name: string;
  email: string;
  role: string;
  services: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  meta_data: any;
  images: string[];
  created_by_admin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogData {
  _id: string;
  title: string;
  author?: Author;
  bannerImageUrl: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  published: boolean;
  service: Service;
  short_description: string;
  __v: number;
}

const SingleBlogScreen: React.FC = ({
      
}) => {
    const route = useRoute();
    const navigation = useNavigation();
      const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
      const [error, setError] = useState<string | null>(null);

    console.log("route.params?.blog", route.params);

      useEffect(() => {
        if (route.params?.blog) {
          setSelectedBlog(route.params.blog);
        }
      }, [route.params?.blog]);

      const handleBack = () => {
        setSelectedBlog(null);
        setError(null);
      };


 return (
      <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <TouchableOpacity onPress={() => {
            navigation.goBack();
          }} style={styles.customButton}>
            <IconButton
              icon="arrow-left"
              iconColor="#000"
              size={24}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Text style={styles.customButtonText}>Back</Text>
          </TouchableOpacity>

          <View style={{padding: 16}}>
            <Image
              source={{uri: selectedBlog?.bannerImageUrl}}
              style={styles.banner}
            />
            <Text style={styles.title}>{selectedBlog?.title}</Text>
            <Text style={styles.author}>
              By {selectedBlog?.author?.name ?? 'Unknown Author'}
            </Text>
            <Text style={styles.description}>
              {selectedBlog?.short_description}
            </Text>
            <RenderHTML source={{html: selectedBlog?.content}} />
          </View>
        </ScrollView>
      </LinearGradient>
    );
};

export default SingleBlogScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  blogCard: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  banner: {
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#222',
    marginTop: 12,
    lineHeight: 22,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  customButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
  },
});

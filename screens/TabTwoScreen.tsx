import React from "react";
import {useEffect, useState} from "react";
import {ActivityIndicator, Dimensions, FlatList, Image, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleSheet} from "react-native";

import {View} from "../components/Themed";
import {getPokemonSprites} from "../mockapi";

export default function TabTwoScreen() {
    const [page, setPage] = useState(0);
    const [pokemons, setPokemons] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPokemonSprites(32, page * 32 + 1).then((result) => {
            setPokemons([...pokemons, ...result]);
            setLoading(false);
        });
    }, [page]);

    const loadMore = () => {
        console.log("loadMore called, page:", page);
        setPage(page + 1);
    };

    const handleLayout = (event: LayoutChangeEvent) => {
        TabTwoScreen.flatListHeight = event.nativeEvent.layout.height;
    };

    const handleContentSizeChange = (width: number, height: number) => {
        TabTwoScreen.contentHeight = height;
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const threshold = 20;
        const prevScrollTop = TabTwoScreen.scrollTop;
        TabTwoScreen.scrollTop = event.nativeEvent.contentOffset.y;
        const isScrollingDown = prevScrollTop <= TabTwoScreen.scrollTop;
        const scrollEnd = TabTwoScreen.contentHeight - TabTwoScreen.flatListHeight;
        const isEndOfList = TabTwoScreen.scrollTop + threshold >= Math.floor(scrollEnd);
        /**
         * When loading indicator appear / disappear, handleScroll will be called without the user having actually scrolled.
         * To prevent this, we require a minimum amount of scroll since last call of the loadMore function.
         */
        const hasScrollPastReq = TabTwoScreen.scrollTop - TabTwoScreen.lastLoadingHeight >= TabTwoScreen.minScrollRequired;
        if (isScrollingDown && isEndOfList && hasScrollPastReq && !loading) {
            TabTwoScreen.lastLoadingHeight = TabTwoScreen.scrollTop;
            loadMore();
        }
    };

    const handleRefresh = () => {
        setPage(0);
        setPokemons([]);
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={pokemons}
                keyExtractor={(item) => item}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
                renderItem={({item}) => <Image style={styles.pokemon} source={{uri: item}} resizeMode={"contain"} />}
                numColumns={4}
                initialNumToRender={32}
                onLayout={handleLayout}
                onContentSizeChange={handleContentSizeChange}
                onScroll={handleScroll}
                ListFooterComponent={() => {
                    if (!loading || page === 0) return <View style={styles.paddingContainer} />;
                    return (
                        <View style={styles.activityIndicator}>
                            <ActivityIndicator />
                        </View>
                    );
                }}
            />
        </View>
    );
}

TabTwoScreen.scrollTop = 0;
TabTwoScreen.contentHeight = 0;
TabTwoScreen.flatListHeight = 0;
TabTwoScreen.lastLoadingHeight = 0;
TabTwoScreen.minScrollRequired = 50;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dddddd",
    },
    list: {
        flex: 1,
        height: "100%",
        width: "100%",
    },
    pokemon: {
        minWidth: 50,
        minHeight: 50,
        width: Dimensions.get("screen").width * 0.25,
        height: Dimensions.get("screen").width * 0.25,
    },
    paddingContainer: {
        padding: 16,
        backgroundColor: "#dddddd",
    },
    activityIndicator: {
        flex: 1,
        height: 16,
        justifyContent: "center",
        backgroundColor: "#dddddd",
    },
});

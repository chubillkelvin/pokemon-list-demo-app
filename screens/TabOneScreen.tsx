import React from "react";
import {useEffect, useState} from "react";
import {ActivityIndicator, Dimensions, FlatList, Image, RefreshControl, StyleSheet} from "react-native";

import {View} from "../components/Themed";
import {getPokemonSprites} from "../mockapi";

export default function TabOneScreen() {
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
                onEndReached={loadMore}
                onEndReachedThreshold={0.01}
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

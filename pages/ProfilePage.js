import { useNavigation, useFocusEffect } from "@react-navigation/core";
import React, { useState }  from "react";
import {View, SafeAreaView, Text, ActivityIndicator, TouchableOpacity, FlatList, TouchableHighlight, StyleSheet, Image, Button, useWindowDimensions} from "react-native";
import {LargeButton} from "../components/LargeButton";
import { auth, db } from "../firebase";

const ProfilePage = () => {
  const navigation = useNavigation()

  const [loading, setLoading] = useState(true); 

  const [userBooks, setUserBooks] = useState([]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  useFocusEffect(React.useCallback(() => {
        db.collection("UserLibraryBooks").where("userID","==",auth.currentUser?.email)
        .get()
        .then((querySnapshot) => {
            const books = [];
            querySnapshot.forEach((doc) => {
                books.push(doc.data().book);
            });
            setUserBooks(books);
            setLoading(false);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        })

    }, []))
    
    if (loading) {
        return <ActivityIndicator />;
    }

    const moveToDescription = (book) => {
        navigation.navigate("Description", {book : book})
    }
    
  return (
    <SafeAreaView style = {styles.mainContainer}>
        <Text>Email: {auth.currentUser?.email}</Text>
        <LargeButton 
                        buttonName = {"Search and add titles"} 
                        onPress = {() => navigation.push("Search")} 
                        style = {styles.searchButton}
        />
        <TouchableOpacity
            onPress={handleSignOut}
            style={styles.button}
        >
        <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
        <FlatList
        data={userBooks}
        numColumns = {2}
        renderItem = {(book) => {
            return(
                <View style = {{height: '5%'}}>
                <TouchableHighlight onPress = {() => moveToDescription(book.item)}>
                <Image style={styles.poster}
                    source={{
                    uri: book.item.imageLinks.smallThumbnail,
                    }} />
                </TouchableHighlight>
                </View>
            )
        }}
        />
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    searchButton: {
        height: '5%',
    },
    mainContainer: {
        alignItems: "center",
        backgroundColor: "#dbb49c",
        flexDirection: "column",
        flex: 1
    },
    poster:{
        width: 150,
        height: 215,
        margin:5
    }
});

export {ProfilePage};


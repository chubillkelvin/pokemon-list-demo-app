# pokemon-list-demo-app

This app serves as a demonstration in how to resolve the problem with `onEndReached` being called multiple times when scrolling in `<FlatList/>` component.

There are certain relevant resources, e.g.:

https://github.com/facebook/react-native/issues/14015#issuecomment-310675650

However, momentum scroll is not supported on `react-native-web` yet.

This repo serves as a demo for how to solve this issue without using the momentum scroll api.

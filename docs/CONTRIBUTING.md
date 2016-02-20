# Try it

```
git clone https://github.com/NathanWalker/nativescript-ezaudio.git
cd nativescript-ezaudio
npm install 

// build out plugin
// you will see a lot of TypeScript warnings, this is normal, you can ignore :)
npm run build  

// now try out the demo
cd demo  
npm install 
tns platform add ios

// run demo in iOS simulator
// you may see more TypeScript warnings, you can ignore :)
npm run demo  
```

**Please note**: Demo works best in **iPhone 6 Simulator** at the moment since I'm using AbsoluteLayout.
I will change this soon to work across various devices.

# Contributing

## Submitting Pull Requests

**Please follow these basic steps to simplify pull request reviews - if you don't you'll probably just be asked to anyway.**

* Please rebase your branch against the current master
* Make reference to possible [issues](https://github.com/NathanWalker/nativescript-ezaudio/issues) on PR comment

## Submitting bug reports

* Please detail the affected platform and version
* Please be sure to state which version of node, npm, and NativeScript you're using
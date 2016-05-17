
Typescript is a superset of javascript with typing, this makes it very appealing in order to have large maintenable projects. Besides, It helps your Ide or text editor with intellisense to prodive you with improved tools. Howver this means that it has to be translated into javascript in order to be used by node.js or in the browser.

I will prepare the project using gulp as the building platform, there are three main tasks that will be performed:

- Typescript compilation to js, that will be handled by a tsconfig.json file
- Include the typescript definitions of the modules used, this is defined in the tsd.json file, however gulp does not perform any task related with this file.
- Include lint checking with tslint.json

## Config Typescript project using tsconfig


## Add definitions from definittely typed

``` javascript
///<reference path="typings/tsd.d.ts" />
```



```

tsd init

```


```
tsd install jquery -r -o -s
```


definitions will be imported using the tsd.json file


## Using tslint

You need to have the tslint.json config file in the same root as the .ts files (ta least for Atom)

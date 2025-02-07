# ColdSweatEvents.registries

## Basic info

- Valid script types: [SERVER]

- Has result? ✘

- Event class: ModRegistriesEventJS (third-party)

### Available fields:

| Name | Type | Static? |
| ---- | ---- | ------- |

Note: Even if no fields are listed above, some methods are still available as fields through *beans*.

### Available methods:

| Name | Parameters | Return type | Static? |
| ---- | ---------- | ----------- | ------- |
| addSoulspringLampFuel | Consumer<FuelBuilderJS> |  | void | ✘ |
| addBiomeTemperature | String, double, double |  | void | ✘ |
| addBiomeTemperature | String, double, double, String |  | void | ✘ |
| addDimensionTemperature | String, double |  | void | ✘ |
| addDimensionTemperature | String, double, String |  | void | ✘ |
| addStructureTemperature | String, double, String |  | void | ✘ |
| addStructureTemperature | String, double |  | void | ✘ |
| addCarriedItemTemperature | Consumer<CarriedItemBuilderJS> |  | void | ✘ |
| addBlockTemperature | Consumer<BlockTempBuilderJS>, Function |  | void | ✘ |
| addBlockTemperature | double, String, Consumer<BlockTempBuilderJS> |  | void | ✘ |
| addFoodTemperature | Consumer<FoodBuilderJS> |  | void | ✘ |
| addInsulator | Consumer<InsulatorBuilderJS> |  | void | ✘ |
| addHearthFuel | Consumer<FuelBuilderJS> |  | void | ✘ |
| addBoilerFuel | Consumer<FuelBuilderJS> |  | void | ✘ |
| addIceboxFuel | Consumer<FuelBuilderJS> |  | void | ✘ |
| addBiomeOffset | String, double, double, String |  | void | ✘ |
| addBiomeOffset | String, double, double |  | void | ✘ |
| addTempModifier | String, Function<TempModifierDataJS, Function<Double, Double>> |  | void | ✘ |
| addStructureOffset | String, double |  | void | ✘ |
| addStructureOffset | String, double, String |  | void | ✘ |
| addDryingItem | Consumer<DryingItemBuilderJS> |  | void | ✘ |
| addDimensionOffset | String, double |  | void | ✘ |
| addDimensionOffset | String, double, String |  | void | ✘ |
| exit | Object |  | Object | ✘ |
| exit |  |  | Object | ✘ |
| success | Object |  | Object | ✘ |
| success |  |  | Object | ✘ |
| cancel | Object |  | Object | ✘ |
| cancel |  |  | Object | ✘ |


### Documented members:

- `Object exit(Object var0)`

  Parameters:
  - var0: Object

```
Stops the event with the given exit value. Execution will be stopped **immediately**.

`exit` denotes a `default` outcome.
```

- `Object exit()`
```
Stops the event with default exit value. Execution will be stopped **immediately**.

`exit` denotes a `default` outcome.
```

- `Object success(Object var0)`

  Parameters:
  - var0: Object

```
Stops the event with the given exit value. Execution will be stopped **immediately**.

`success` denotes a `true` outcome.
```

- `Object success()`
```
Stops the event with default exit value. Execution will be stopped **immediately**.

`success` denotes a `true` outcome.
```

- `Object cancel(Object var0)`

  Parameters:
  - var0: Object

```
Cancels the event with the given exit value. Execution will be stopped **immediately**.

`cancel` denotes a `false` outcome.
```

- `Object cancel()`
```
Cancels the event with default exit value. Execution will be stopped **immediately**.

`cancel` denotes a `false` outcome.
```



### Example script:

```js
ColdSweatEvents.registries((event) => {
	// This space (un)intentionally left blank
});
```


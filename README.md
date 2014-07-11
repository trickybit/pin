# pin(@area, @point)

Set the pinnable area and point of interest

```less
figure {
  .pin(50% 50vmin, 50% 50%);
}
```

# pin.side(@slice)

Align the element within a pinnable area. To contain the dimensions of the element, use .pin.in.side instead.

```less
figure {
  .pin(50% 50vmin, 50% 50%);
  
  figcaption {
    .pin.side(9);
  }
}
```

# pin.in(@slice)

Contain the element within a pinnable area using 9-slice. Use ths to avoid the area of interest.

```less
figure {
  .pin(50% 50vmin, 50% 50%);
  
  figcaption {
    .pin.in(9);
  }
}
```

# pin.in.side(@slice)

Align the element within a pinnable slice using 9-slice.

```less
figure {
  .pin(50% 50vmin, 50% 50%);
  
  figcaption {
    .pin.in(9);
    .pin.in.side(1);
    
    .ie9 & .pin-content {
      .pin.in.side(1);
    }
  }
}
```

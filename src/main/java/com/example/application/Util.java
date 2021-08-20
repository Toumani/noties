package com.example.application;

public class Util {
    private static String[] categories = new String[] {
            "Épicerie",
            "Travail",
            "Personnel",
            "Santé",
            "Sorties"
    };
    private static String[] colors = new String[] {
            "crimson",
            "lime",
            "cyan",
            "aquamarine",
            "deepskyblue",
            "black"
    };

    public static String getRandomCategory() {
        int randomNumberBetweenZeroAndHundred = new Double(Math.random()*100).intValue();
        return categories[randomNumberBetweenZeroAndHundred % categories.length];
    }

    public static String getRandomColor() {
        int randomNumberBetweenZeroAndHundred = new Double(Math.random()*100).intValue();
        return colors[randomNumberBetweenZeroAndHundred % colors.length];
    }
}

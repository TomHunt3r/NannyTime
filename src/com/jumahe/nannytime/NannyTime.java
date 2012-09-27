package com.jumahe.nannytime;

import android.os.Bundle;
import android.app.Activity;
import org.apache.cordova.*;

public class NannyTime extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl("file:///android_asset/www/index.html", 3000);
    }
}

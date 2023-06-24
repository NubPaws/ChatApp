package com.example.androidapp.utils;

import android.app.Activity;

import androidx.core.view.accessibility.AccessibilityViewCommand;

import java.sql.Array;
import java.util.ArrayList;
import java.util.List;

public class ActivityTracker {

    private static ActivityTracker instance = null;

    public static ActivityTracker getInstance() {
        if (instance == null)
            instance = new ActivityTracker();
        return instance;
    }

    private ArrayList<Activity> activityList;

    private ActivityTracker() {
        activityList = new ArrayList<Activity>();
    }

    public void add(Activity activity) {
        activityList.add(activity);
    }

    public void remove(Activity activity) {
        activityList.remove(activity);
    }

    public void finishAllActivities() {
        List<Activity> tmp = new ArrayList<>(activityList);
        for (Activity activity : tmp) {
            activity.finish();
        }
        activityList.clear();
    }

}

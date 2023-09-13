package com.example.androidapp.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Locale;

public class JSDateParser {

    /* private static final String JS_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"; */

    private String dateStr;

    private int year;
    private int month;
    private int day;
    private int hour;
    private int minute;
    private int second;
    private int millisecond;

    public String getDateStr() {
        return dateStr;
    }

    public void setDateStr(String dateStr) {
        this.dateStr = dateStr;

        Instant instant = Instant.parse(dateStr);
        LocalDateTime ldt = LocalDateTime.ofInstant(instant, ZoneId.ofOffset("UTC", ZoneOffset.ofHours(3)));

        year = ldt.getYear();
        month = ldt.getMonthValue();
        day = ldt.getDayOfMonth();
        hour = ldt.getHour();
        minute = ldt.getMinute();
        second = ldt.getSecond();
        millisecond = ldt.getNano() / 1000000;
    }

    public String getFullDate() {
        return String.format(Locale.US,
                "%02d:%02d %02d/%02d/%04d", hour, minute, day, month, year);
    }

    public String getTimeOfDay() {
        return String.format(Locale.US,
                "%02d:%02d", hour, minute);
    }

    public int getYear() {
        return year;
    }

    public int getMonth() {
        return month;
    }

    public int getDay() {
        return day;
    }

    public int getHour() {
        return hour;
    }

    public int getMinute() {
        return minute;
    }

    public int getSecond() {
        return second;
    }

    public int getMillisecond() {
        return millisecond;
    }
}

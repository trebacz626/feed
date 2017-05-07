package com.wordpress.trebaczkacper.androidapp;

/**
 * Created by treba on 07.05.2017.
 */

import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.Cursor;
import android.content.Context;
import android.content.ContentValues;

public class DBHandler extends SQLiteOpenHelper {
    private static final int DATABASE_VERSION = 1;
    private static final String DATABASE_NAME = "simple-cooking.db";
    public static final String TABLE_USERS = "users";
    public static final String COLUMN_ID = "id";
    public static final String COLUMN_NAME ="name";
    public static final String COLUMN_PASSWORD ="password";
    //public static final String COLUMN_TOKEN ="token";

    public DBHandler(Context context, String name, SQLiteDatabase.CursorFactory factory, int version) {
        super(context, DATABASE_NAME, factory, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String query="CREATE TABLE" + TABLE_USERS + "(" +
                COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
                COLUMN_NAME + " TEXT," +
                COLUMN_PASSWORD + " TEXT " +
                ");";
        db.execSQL(query);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS "+ TABLE_USERS);
        onCreate(db);
    }

    public void addUser(User user){
        ContentValues values = new ContentValues();
        values.put(COLUMN_NAME,user.getName());
        values.put(COLUMN_PASSWORD,user.getPassword());
        //values.put(COLUMN_TOKEN,user.getToken());
        SQLiteDatabase db = getWritableDatabase();
        db.insert(TABLE_USERS,null,values);
        db.close();
    }

    public void deleteUser(String userName){
        SQLiteDatabase db = getWritableDatabase();
        db.execSQL("DELETE FROM "+TABLE_USERS+ " WHERE "+COLUMN_NAME+ " =\""+ userName + "\";" );
        db.close();
    }

    public User getUser(){
        SQLiteDatabase db = getWritableDatabase();
        String query = "SELECT * FROM "+ TABLE_USERS+ " WHERE 1";
        Cursor c = db.rawQuery(query,null);

        c.moveToFirst();
        User user = new User(c.getColumnIndex("id"),c.getString(c.getColumnIndex("name")),c.getString(c.getColumnIndex("password")));
        return user;
    }
}

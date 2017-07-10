package com.wordpress.trebaczkacper.androidapp;

/**
 * Created by treba on 07.05.2017.
 */

public class User {
    private int id;
    private String name;

    private String token;

    public User() {
    }

    public User(int id, String name, String token) {
        this.id = id;
        this.name = name;
        this.token = token;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }


    public String getToken() {
        return token;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setToken(String token) {
        this.token = token;
    }
}



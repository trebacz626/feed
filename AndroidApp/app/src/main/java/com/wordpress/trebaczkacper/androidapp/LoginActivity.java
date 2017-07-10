package com.wordpress.trebaczkacper.androidapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class LoginActivity extends AppCompatActivity  {
    private TextView message;
    private EditText emailText;
    private EditText password;
    private Button loginButton;

    private DBHandler dbHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        message = (TextView) findViewById(R.id.message);
        emailText = (EditText) findViewById(R.id.email);
        password = (EditText) findViewById(R.id.password);
        loginButton = (Button) findViewById(R.id.loginButton);



        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });
        loginButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {


               SendPostRequest sPR = new SendPostRequest(new Callback(){
                   @Override
                   public void callback(Object json){
                       onJSONData((JSONObject)json);
                   }
               });
                ArrayList<String[]> list= new ArrayList<String[]>();
                list.add(new String[]{"URL","http://10.0.2.2:8080/api/login"});
                list.add(new String[]{"mail",emailText.getText().toString()});
                list.add(new String[]{"password",password.getText().toString()});
                sPR.execute(list);

            }
        });


        dbHandler = new DBHandler(this,null,null,1);
    }

    public Activity getActivity() {
        return this;
    }


    
    public void onJSONData(JSONObject json){
        if(json!=null){
            message.setText(json.toString());

            /*User user = new User();
            Log.d("d","one");
            try {
                user.setName(json.getJSONObject("userInfo").getString("email"));
                user.setPassword(json.getJSONObject("userInfo").getString("password"));
            } catch (JSONException e) {
                e.printStackTrace();
            }
            try {
                dbHandler.deleteUser(user.getName());
            }catch(Exception e){
                Log.d("D",e.getMessage());
            }
            dbHandler.addUser(user);
            User user2 = dbHandler.getUser();

            //Toast.makeText(getApplicationContext(), "Logged as "+ email+" with pasword: "+password,Toast.LENGTH_LONG).show();
            Toast.makeText(getApplicationContext(), "Logged as "+ user2.getName()+" with pasword: "+user2.getPassword(),Toast.LENGTH_LONG).show();
            Intent resultIntent = new Intent();
            resultIntent.putExtra("email", user2.getName());
            resultIntent.putExtra("password", user2.getPassword());
            setResult(Activity.RESULT_OK, resultIntent);
            finish();*/

        }else{
            Toast.makeText(getApplicationContext(), "POST FAILED",
                    Toast.LENGTH_LONG).show();
        }
    }

}

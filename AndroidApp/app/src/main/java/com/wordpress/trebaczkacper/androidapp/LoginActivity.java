package com.wordpress.trebaczkacper.androidapp;

import android.app.Activity;
import android.content.Context;
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
                list.add(new String[]{"URL","http://10.0.2.2:8080/login"});
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


    /*
    public class SendPostRequest extends AsyncTask<String, Void, String> {

        protected void onPreExecute(){}

        protected String doInBackground(String... params) {

            try {
                //URL url = new URL("https://testy-trebacz626.c9users.io/connect");
                URL url = new URL("http://10.0.2.2:8080/login");
                JSONObject postData = new JSONObject();
                postData.put("mail", params[0] );
                postData.put("password", params[1] );
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setReadTimeout(15000);
                conn.setConnectTimeout(15000 /*  );
                conn.setRequestMethod("POST");
                conn.setDoInput(true);
                conn.setDoOutput(true);

                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os,"UTF-8"));
                writer.write(getPostDataString(postData));
                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();

                if(responseCode==HttpURLConnection.HTTP_OK){
                    BufferedReader in= new BufferedReader(
                            new InputStreamReader(
                                    conn.getInputStream()
                                    )
                    );
                    StringBuffer sb = new StringBuffer("");
                    String line ="";
                    while((line=in.readLine())!=null){
                        sb.append(line);

                    }

                    in.close();
                    return sb.toString();
                }else{
                    return new String("false: "+responseCode);
                }

            } catch (Exception e) {
                return new String("Exception: " + e.getMessage());
            }


        }
        @Override
        protected void onPostExecute(String result) {
            try {
                JSONObject json = new JSONObject(result);
                message.setText(json.toString());

               // SharedPreferences sharedPref = getActivity().getPreferences(Context.MODE_PRIVATE);
                //SharedPreferences.Editor editor = sharedPref.edit();
                //editor.putString("email", json.getJSONObject("user").getString("email"));
               // editor.putString("password", json.getJSONObject("user").getString("password"));
                //editor.commit();
                //String defaultValue = "error";
               // String email = sharedPref.getString("email", defaultValue);
               //String password = sharedPref.getString("password", defaultValue);
                User user = new User();
                user.setName(json.getJSONObject("user").getString("email"));
                user.setPassword(json.getJSONObject("user").getString("password"));
                dbHandler.addUser(user);
                User user2 = dbHandler.getUser();

                //Toast.makeText(getApplicationContext(), "Logged as "+ email+" with pasword: "+password,Toast.LENGTH_LONG).show();
                Toast.makeText(getApplicationContext(), "Logged as "+ user2.getName()+" with pasword: "+user2.getPassword(),Toast.LENGTH_LONG).show();
            }catch(Exception e){
                Toast.makeText(getApplicationContext(), result,
                        Toast.LENGTH_LONG).show();
            }

            Toast.makeText(getApplicationContext(), result,
                    Toast.LENGTH_LONG).show();

        }

        public String getPostDataString(JSONObject params) throws Exception{
            StringBuilder result = new StringBuilder();
            boolean first = true;
            Iterator<String> itr = params.keys();
            while(itr.hasNext()){
                String key=itr.next();
                Object value= params.get(key);

                if(first){
                    first=false;
                }else{
                    result.append("&");
                }
                result.append(URLEncoder.encode(key,"UTF-8"));
                result.append("=");
                result.append(URLEncoder.encode(value.toString(),"UTF-8"));
            }
            return result.toString();
        }


}


*/
    public void onJSONData(JSONObject json){
        if(json!=null){
            message.setText(json.toString());

            User user = new User();
            try {
                user.setName(json.getJSONObject("user").getString("email"));
                user.setPassword(json.getJSONObject("user").getString("password"));
            } catch (JSONException e) {
                e.printStackTrace();
            }

            dbHandler.addUser(user);
            User user2 = dbHandler.getUser();

            //Toast.makeText(getApplicationContext(), "Logged as "+ email+" with pasword: "+password,Toast.LENGTH_LONG).show();
            Toast.makeText(getApplicationContext(), "Logged as "+ user2.getName()+" with pasword: "+user2.getPassword(),Toast.LENGTH_LONG).show();

        }else{
            Toast.makeText(getApplicationContext(), "POST FAILED",
                    Toast.LENGTH_LONG).show();
        }
    }

}

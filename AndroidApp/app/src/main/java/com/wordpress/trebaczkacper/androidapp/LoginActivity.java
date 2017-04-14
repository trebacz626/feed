package com.wordpress.trebaczkacper.androidapp;

import android.os.AsyncTask;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

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
import java.util.Iterator;

public class LoginActivity extends AppCompatActivity {
    private TextView message;
    private EditText name;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        message = (TextView) findViewById(R.id.message);
        name = (EditText) findViewById(R.id.name);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });
        name.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {


                new SendPostRequest().execute(name.getText().toString());

            }
        });
    }
    public class SendPostRequest extends AsyncTask<String, Void, String> {

        protected void onPreExecute(){}

        protected String doInBackground(String... params) {

            try {
                URL url = new URL("https://testy-trebacz626.c9users.io/connect");
                JSONObject postData = new JSONObject();
                postData.put("userName", params[0] );
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setReadTimeout(15000);
                conn.setConnectTimeout(15000 /*  */);
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
                message.setText(json.getString("message"));
            }catch(Exception e){

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

}

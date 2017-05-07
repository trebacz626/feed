package com.wordpress.trebaczkacper.androidapp;

import android.os.AsyncTask;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Iterator;

/**
 * Created by treba on 07.05.2017.
 */

public class SendPostRequest extends AsyncTask<String,Void,String> {

    Callback callback;
    public SendPostRequest(Callback callback) {
        this.callback=callback;
    }

    @Override
    protected String doInBackground(String... params) {
        try {
            //URL url = new URL("https://testy-trebacz626.c9users.io/connect");
            URL url = new URL("http://10.0.2.2:8080/login");
            JSONObject postData = new JSONObject();
            postData.put("mail", params[0] );
            postData.put("password", params[1] );
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
            callback.callback(json);
        } catch (JSONException e) {
            e.printStackTrace();
            callback.callback(null);
        }
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

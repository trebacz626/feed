package com.wordpress.trebaczkacper.androidapp;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.lang.reflect.Array;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by treba on 07.05.2017.
 */

public class SendPostRequest extends AsyncTask<ArrayList<String[]>,Void,String> {

    Callback callback;
    public SendPostRequest(Callback callback) {
        this.callback=callback;
    }

    @Override
    protected String doInBackground( ArrayList<String[]> ...Arrayoflist) {
        try {
            //URL url = new URL("https://testy-trebacz626.c9users.io/connect");


            List<String[]> list = Arrayoflist[0];
            URL url = new URL(list.get(0)[1]);
            JSONObject postData = new JSONObject();
            for(int i =1;i<list.size();i++){
                postData.put(list.get(i)[0],list.get(i)[1]);

            }

            //postData.put("mail", params[1] );
            //postData.put("password", params[1] );
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(15000);
            conn.setConnectTimeout(15000 /*  */);
            conn.setRequestMethod("POST");
            conn.setDoInput(true);
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os,"UTF-8"));
            writer.write(getPostDataString2(list));
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
        Log.d("T",result.toString());
        return result.toString();
    }


    public String getPostDataString2(List<String[]> list) throws Exception{
        StringBuilder result = new StringBuilder();
        boolean first = true;
        int i=0;
        while(i<list.size()){
            String key= list.get(i)[0];
            Object value= list.get(i)[1];

            if(first){
                first=false;
            }else{
                result.append("&");
            }
            result.append(URLEncoder.encode(key,"UTF-8"));
            result.append("=");
            result.append(URLEncoder.encode(value.toString(),"UTF-8"));
            i++;
        }
        Log.d("T",result.toString());
        return result.toString();
    }
}

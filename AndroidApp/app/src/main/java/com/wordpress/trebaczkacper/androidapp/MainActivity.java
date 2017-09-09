package com.wordpress.trebaczkacper.androidapp;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.util.Log;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {

    private ViewFlipper vf;
    private NavigationView navView;
    private View navHeaderView;

    private TextView emailTextView;

    private DBHandler dbHandler;


    private EditText dishNameEditText;
    private EditText ingredient1EditText;
    private EditText ingredient2EditText;
    private EditText recipeEditText;

    private Button addDishButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d("CREATOR","creating");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);




        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);
        vf=(ViewFlipper) findViewById(R.id.vf);
        navView = (NavigationView) findViewById(R.id.nav_view);
        navHeaderView= navView.getHeaderView(0);
        emailTextView = (TextView) navHeaderView.findViewById(R.id.UserEmail);
        try {
            emailTextView.setText(dbHandler.getUser().getName());
        }catch(Exception e){

        }

        ingredient1EditText= (EditText) findViewById(R.id.ingredient1);
        ingredient2EditText= (EditText) findViewById(R.id.ingredient2);
        dishNameEditText= (EditText) findViewById(R.id.dishName);
        recipeEditText= (EditText) findViewById(R.id.recipe);
        addDishButton = (Button) findViewById(R.id.addDishButton);
        dbHandler = new DBHandler(this,null,null,1);

        addDishButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {


                SendPostRequest sPR = new SendPostRequest(new Callback(){
                    @Override
                    public void callback(Object json){
                        onJSONData((JSONObject)json);
                    }
                });
                ArrayList<String[]> list= new ArrayList<String[]>();
                list.add(new String[]{"URL","http://10.0.2.2:8080/api/addDish"});
                User user = dbHandler.getUser();

                list.add(new String[]{"mail",user.getName()});
                //----------------------------------------\\\\\\\\\\\\\\\\\\ Repair other routes on serwer
                //list.add(new String[]{"password",user.getPassword()});
                list.add(new String[]{"dishName",dishNameEditText.getText().toString()});
                list.add(new String[]{"ingredient",ingredient1EditText.getText().toString()});
                list.add(new String[]{"ingredient",ingredient2EditText.getText().toString()});
                list.add(new String[]{"recipe",recipeEditText.getText().toString()});
                sPR.execute(list);

            }
        });

    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();
        Log.d("CREATOR","nav");
        if (id == R.id.nav_log) {
            Log.d("CREATOR","login click");
            //Intent intent = new Intent(this,LoginActivity.class);
            //startActivityForResult(intent,1);

            Intent intent = new Intent(this,GoogleLoginActivity.class);
            startActivity(intent);
        } else if (id == R.id.nav_profile) {
            vf.setDisplayedChild(1);
        }else if (id == R.id.nav_search) {
            vf.setDisplayedChild(2);
        }else if (id == R.id.nav_add) {
            vf.setDisplayedChild(3);
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    @Override
    public void onActivityResult(int requestCode,int resultCode,Intent data){
        super.onActivityResult(requestCode,resultCode, data);
        switch(requestCode) {
            case 1: {
                if (resultCode == Activity.RESULT_OK) {
                    String email = data.getStringExtra("email");
                    emailTextView.setText(email);

                }
            }
        }
    }

    public void onJSONData(JSONObject json){
        Toast.makeText(getApplicationContext(), json.toString(),Toast.LENGTH_LONG).show();
    }


}

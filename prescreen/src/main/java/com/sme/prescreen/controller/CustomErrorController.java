package com.sme.prescreen.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomErrorController implements ErrorController {

    // This method catches ALL 404 errors (Page Not Found)
    @RequestMapping("/error")
    public String handleError() {
        // Redirect the user back to the React App
        return "forward:/index.html";
    }
}
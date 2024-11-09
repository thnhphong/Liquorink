<?php 
if(isset($_GET['name'])){
  $name = htmlspecialchars(($_GET['name']));
  echo "Hello, " . $name . "! Welcome to our site";
}else{
  echo "Hello, Welcome to out site";
}
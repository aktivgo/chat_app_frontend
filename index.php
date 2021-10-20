<?php

use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;
use Symfony\Component\HttpFoundation\Request;

require_once __DIR__ . "/composer/vendor/autoload.php";

try {

    $routeIndex = new Route('/');
    $routeAuthorization = new Route('/authorization');
    $routeRegistration = new Route('/registration');
    $routeProfile = new Route('/profile');

    $routes = new RouteCollection();
    $routes->add('index', $routeIndex);
    $routes->add('authorization', $routeAuthorization);
    $routes->add('registration', $routeRegistration);
    $routes->add('profile', $routeProfile);

    $context = new RequestContext();
    $context->fromRequest(Request::createFromGlobals());

    $matcher = new UrlMatcher($routes, $context);
    $parameters = $matcher->match($context->getPathInfo());

} catch (Exception $e) {
    http_response_code(404);
    die();
}

if($parameters['_route'] === 'index') {
    require_once 'templates/index-template.html';
    return;
}

if($parameters['_route'] === 'authorization') {
    require_once 'templates/authorization-template.html';
    return;
}

if($parameters['_route'] === 'registration') {
    require_once 'templates/registration-template.html';
    return;
}

if($parameters['_route'] === 'profile') {
    require_once 'templates/profile-template.html';
    return;
}
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
    $routeChat = new Route('/chat');

    $routes = new RouteCollection();
    $routes->add('index', $routeIndex);
    $routes->add('authorization', $routeAuthorization);
    $routes->add('registration', $routeRegistration);
    $routes->add('chat', $routeChat);

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

if($parameters['_route'] === 'chat') {
    echo "<script>window.WEBSOCKET_CONNECTION_URL = '{$_ENV['WEBSOCKET_CONNECTION_URL']}'</script>";
    require_once 'templates/chat-template.html';
    return;
}
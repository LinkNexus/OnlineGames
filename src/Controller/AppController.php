<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Attribute\Route;

class AppController extends AbstractController
{
    #[Route('/app', name: 'app_app')]
    public function index(): Response
    {
        return $this->render('app/index.html.twig');
    }

    #[Route('/publish', name: 'app_publish', methods: ['POST'])]
    public function publish(HubInterface $hub): Response
    {
        $hub->publish(
            new Update(
                'http://localhost:5001/test',
                json_encode(['status' => 'Mercure is functioning!'])
            )
        );

        return $this->redirectToRoute('app_app');
    }
}

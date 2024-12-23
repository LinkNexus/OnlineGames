<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
final class ApiController extends AbstractController
{
    #[Route('/join', methods: ['POST'])]
    public function notifyParticipation(HubInterface $hub, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $hub->publish(
            new Update(
                'http://localhost:5001/join',
                json_encode($data)
            )
        );

        return new JsonResponse();
    }

    #[Route('/players/synchronize', methods: ['POST'])]
    public function synchronizePlayers(HubInterface $hub, Request $request): JsonResponse
    {
        $hub->publish(
            new Update(
                'http://localhost:5001/players/synchronize',
                $request->getContent()
            )
        );

        return new JsonResponse();
    }

    #[Route('/players/is-ready', methods: ['POST'])]
    public function isPlayerReady(HubInterface $hub, Request $request): JsonResponse
    {
        $hub->publish(
            new Update(
                'http://localhost:5001/players/is-ready',
                $request->getContent()
            )
        );

        return new JsonResponse();
    }
}

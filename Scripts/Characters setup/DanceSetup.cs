using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DanceSetup : MonoBehaviour {
	
	public Transform playerPosition;
	public Transform opponentPosition;
	
	public RuntimeAnimatorController danceController;
	
	GameObject playerPrefab;
	GameObject opponentPrefab;
    
	void Awake(){
		playerPrefab = Resources.Load<GameObject>("Character prefabs/Player base prefab");
		opponentPrefab = Resources.Load<GameObject>("Character prefabs/Opponent base prefab");
		
		if(playerPrefab == null || opponentPrefab == null){
			Debug.LogWarning("No player/opponent prefab in resources");
			
			return;
		}
		
		GameObject newOpponent = Instantiate(opponentPrefab, opponentPosition.position, opponentPosition.rotation);
		newOpponent.GetComponent<Opponent>().enabled = false;
			
		GameObject newPlayer = Instantiate(playerPrefab, playerPosition.position, playerPosition.rotation);
		newPlayer.GetComponent<Player>().enabled = false;
		
		newOpponent.GetComponent<Animator>().runtimeAnimatorController = danceController;
		newPlayer.GetComponent<Animator>().runtimeAnimatorController = danceController;
		
		DanceScene danceScene = FindObjectOfType<DanceScene>();
		danceScene.player = newPlayer.GetComponent<Animator>();
		danceScene.opponent = newOpponent.GetComponent<Animator>();
		
		newPlayer.GetComponentInChildren<ParticleSystem>().Stop();
		newOpponent.GetComponentInChildren<ParticleSystem>().Stop();
	}
}

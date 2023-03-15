using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PowerupBall : MonoBehaviour {
	
	//powerup effect
	public GameObject effect;
	
	Player player;
	PowerupBallSpawner spawner;
    
    void Start(){
		//find player
        player = GameObject.FindObjectOfType<Player>();
    }
	
	//when triggered by tennis ball, show fire ball and spawn new powerup
    void OnTriggerEnter(Collider other){
		Ball ball = other.gameObject.GetComponent<Ball>();
		
		if(ball == null || !ball.GetLastHit())
			return;
		
		player.ComboDone(ball);
		
		spawner.RandomSpawn();
		
		Destroy(gameObject);
	}
	
	//assign the powerup spawner
	public void SetSpawner(PowerupBallSpawner spawner){
		this.spawner = spawner;
	}
}

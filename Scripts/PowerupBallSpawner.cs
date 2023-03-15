using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PowerupBallSpawner : MonoBehaviour {
    
	public GameObject powerup;
	public float range;
	public int chance;
	
	GameObject ball;
	
	void Start(){
		//spawning immediately:
		//RandomSpawn();
	}
	
	//randomly choose to spawn or not to spawn a powerup in a random position
	public void RandomSpawn(){
		if(Random.Range(0, chance) != 0 || ball != null)
			return;
		
		Vector3 position = transform.position + Vector3.right * Random.Range(-range, range);
		
		ball = Instantiate(powerup, position, powerup.transform.rotation);
		ball.GetComponent<PowerupBall>().SetSpawner(this);
	}
}

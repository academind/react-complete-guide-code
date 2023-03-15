using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//creates the random visitor rows
public class VisitorSpawner : MonoBehaviour {
    
	public GameObject visitor;
	public Transform[] rows;
	public int numRow;
	public float space;
	public float randomPos;
	public Vector3 rotation;
	public float kidSize;
	public int visitorChanceMin;
	public int visitorChanceMax;
	public float kidOffset;
	
	//materials to randomly choose from
	public Material[] pants;
	public Material[] shirts;
	public Material[] skinTones;
	public Material[] shoes;
	public Material[] hats;
	
	int visitorChance;
	
	List<Animator> anims = new List<Animator>();
	
	void Awake(){
		//visitorChance = Random.Range(visitorChanceMin, visitorChanceMax);
		
		//visitor chance is based on the match, for example the first match has less visitors than the finals
		visitorChance = (PlayerPrefs.GetInt("Tournament Match Number") * 2) + 2;
	}
	
	void Start(){
		//for all rows
		for(int i = 0; i < rows.Length; i++){
			Vector3 startPos = rows[i].position;
			
			int visitorCount = i % 2 == 0 ? numRow : numRow - 1;
			
			//spawn visitors
			for(int j = 0; j < visitorCount; j++){
				if(Random.Range(0, visitorChance) != 0){
					//completely randomize all visitor settings
					bool kid = Random.Range(0, 2) == 0;
					
					Vector3 pos = kid ? startPos + Vector3.up * kidOffset : startPos;
					pos.x -= j * space;
					pos.x += Random.Range(-randomPos, randomPos);
					GameObject newVisitor = Instantiate(visitor, pos, Quaternion.Euler(rotation));
					
					Visitor vis = newVisitor.GetComponent<Visitor>();
				
					Animator anim = vis.anim;
					anim.SetInteger("Type", Random.Range(0, 5));
					anim.speed = Random.Range(0.75f, 1.2f);
					anims.Add(anim);
					
					vis.eyes.speed = Random.Range(0.85f, 1.15f);
					
					Material[] currentMaterials = vis.rend.materials;
					
					currentMaterials[0] = pants[Random.Range(0, pants.Length)];
					currentMaterials[1] = shirts[Random.Range(0, shirts.Length)];
					currentMaterials[2] = skinTones[Random.Range(0, skinTones.Length)];
					currentMaterials[3] = shoes[Random.Range(0, shoes.Length)];
					
					//assign the random materials
					vis.rend.materials = currentMaterials;
					
					vis.hat.GetComponent<Renderer>().material = hats[Random.Range(0, hats.Length)];
					vis.hat.SetActive(Random.Range(0, 3) == 0);
					
					//scale visitor down if it's a kid
					if(kid)
						newVisitor.transform.localScale *= kidSize;
				}
			}
		}
	}
	
	//make all visitors cheer
	public void Cheer(){
		for(int i = 0; i < anims.Count; i++){
			int random = Random.Range(0, 3);
			anims[i].SetFloat("CheeringType", (float)random/2f);
			
			anims[i].SetTrigger("Cheer");
		}
	}
	
	//make all visitors act disappointed
	public void Disbelief(){
		for(int i = 0; i < anims.Count; i++){
			int random = Random.Range(0, 3);
			anims[i].SetFloat("SadType", (float)random/2f);
			
			anims[i].SetTrigger("Sad");
		}
	}
}

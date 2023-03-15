using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FaceCamera : MonoBehaviour {
  
    void Update(){
		//face the direction of the main camera
        transform.LookAt(2 * Camera.main.transform.position - transform.position);
    }
}
